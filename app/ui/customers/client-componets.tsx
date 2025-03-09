'use client'
import { useState } from 'react'

export function CopyText( {text} : {text: string}) {

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
  }
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className='emailContainerStyle'
      onClick={() => copyToClipboard(text)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)} >
      <p className="text-sm dark:text-slate-100 dark:hover:text-slate-400 emailContainerStyle" >
        {text}
        {showTooltip && <span className='tooltipStyle'>Copiar</span>}
      </p>
    </div>
  );
}