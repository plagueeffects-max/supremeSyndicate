import { ComponentProps } from 'react'

function NextImage({ src, alt, ...props }: ComponentProps<'img'>) {
  return <img src={typeof src === 'string' ? src : 'mock-image'} alt={alt} {...props} />
}

export default NextImage
