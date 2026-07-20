import os
import psycopg2
from datetime import datetime, timezone

SITE_URL = os.environ.get('SITE_URL', 'https://wf-pc.ru').rstrip('/')

STATIC_PAGES = [
    ('/', 'daily', '1.0'),
    ('/catalog', 'daily', '0.9'),
    ('/build', 'weekly', '0.9'),
    ('/reviews', 'weekly', '0.7'),
    ('/faq', 'monthly', '0.6'),
    ('/articles', 'weekly', '0.7'),
    ('/contacts', 'monthly', '0.6'),
    ('/privacy', 'yearly', '0.3'),
    ('/consent', 'yearly', '0.3'),
]


def _fmt_date(value) -> str:
    if isinstance(value, datetime):
        return value.date().isoformat()
    return datetime.now(timezone.utc).date().isoformat()


def _get_articles():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT slug, updated_at FROM articles "
            "WHERE is_published = TRUE ORDER BY id DESC"
        )
        rows = cur.fetchall()
        cur.close()
        return rows
    finally:
        conn.close()


def _build_xml() -> str:
    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, freq, prio in STATIC_PAGES:
        parts.append('  <url>')
        parts.append(f'    <loc>{SITE_URL}{path}</loc>')
        parts.append(f'    <changefreq>{freq}</changefreq>')
        parts.append(f'    <priority>{prio}</priority>')
        parts.append('  </url>')
    for slug, updated_at in _get_articles():
        parts.append('  <url>')
        parts.append(f'    <loc>{SITE_URL}/articles/{slug}</loc>')
        parts.append(f'    <lastmod>{_fmt_date(updated_at)}</lastmod>')
        parts.append('    <changefreq>monthly</changefreq>')
        parts.append('    <priority>0.6</priority>')
        parts.append('  </url>')
    parts.append('</urlset>')
    return '\n'.join(parts)


def handler(event: dict, context) -> dict:
    '''Отдаёт актуальный sitemap.xml со списком статических страниц и опубликованных статей из БД.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }
    xml = _build_xml()
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600',
        },
        'isBase64Encoded': False,
        'body': xml,
    }
