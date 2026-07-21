import os
import html
import psycopg2

SITE_URL = os.environ.get('SITE_URL', 'https://wf-pc.ru').rstrip('/')
DEFAULT_IMAGE = f"{SITE_URL}/og-image.jpg?v=3"
SITE_NAME = 'White Friday PC'


def _get_article(slug: str):
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT title, excerpt, cover_url, slug FROM articles "
            "WHERE slug = %s AND is_published = TRUE",
            (slug,)
        )
        row = cur.fetchone()
        cur.close()
        return row
    finally:
        conn.close()


def _page(title, description, image, url):
    t = html.escape(title)
    d = html.escape(description or title)
    img = html.escape(image)
    u = html.escape(url)
    return f'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>{t}</title>
<meta name="description" content="{d}">
<meta property="og:type" content="article">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:image" content="{img}">
<meta property="og:url" content="{u}">
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:locale" content="ru_RU">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{img}">
<link rel="canonical" href="{u}">
<meta http-equiv="refresh" content="0; url={u}">
</head>
<body>
<p>Переход к статье: <a href="{u}">{t}</a></p>
<script>location.replace("{u}");</script>
</body>
</html>'''


def handler(event: dict, context) -> dict:
    '''Отдаёт HTML с Open Graph тегами обложки статьи для превью в соцсетях и мессенджерах.'''
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

    params = event.get('queryStringParameters') or {}
    slug = (params.get('slug') or '').strip()

    title = SITE_NAME
    description = 'Сборка игровых и рабочих компьютеров на заказ'
    image = DEFAULT_IMAGE
    url = f"{SITE_URL}/articles/{slug}" if slug else SITE_URL

    if slug:
        row = _get_article(slug)
        if row:
            a_title, a_excerpt, a_cover, a_slug = row
            title = a_title or title
            description = a_excerpt or a_title or description
            if a_cover:
                image = a_cover
            url = f"{SITE_URL}/articles/{a_slug}"

    body = _page(title, description, image, url)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=600',
        },
        'isBase64Encoded': False,
        'body': body,
    }