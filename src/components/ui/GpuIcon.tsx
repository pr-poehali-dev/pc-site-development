const GPU_MASK = 'https://cdn.poehali.dev/projects/0a71aae6-cb4d-4e72-8bca-09cec031315c/bucket/4e37a1bb-6cdc-4e82-9922-fb0d526a1446.png';

const GpuIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <span
    aria-hidden
    className={`inline-block shrink-0 bg-current ${className}`}
    style={{
      width: size,
      height: size,
      WebkitMaskImage: `url(${GPU_MASK})`,
      maskImage: `url(${GPU_MASK})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }}
  />
);

export default GpuIcon;
