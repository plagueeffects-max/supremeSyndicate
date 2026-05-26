import { ComponentProps } from 'react'

function NextLink({ href, children, ...props }: ComponentProps<'a'> & { href: string }) {
  return <a href={href} {...props}>{children}</a>
}

export default NextLink
