import { Fragment } from 'react'

/** Troca *trechos* por um <span> em destaque. Os textos longos ficam inteiros em strings.ts. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((parte, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-cream">
            {parte}
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  )
}
