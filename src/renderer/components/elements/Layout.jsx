import React, { useContext } from 'react'
import LocaleContext from '../../utils/LocaleContext'

function Layout(props) {
  const { locale, setLocale } = useContext(LocaleContext)
    
  function changeLocale (e) {
    setLocale(e.target.name)
  }
  const handleChange = (event) => {
    setLocale(event.target.value);
  };

  return(
    <>
      <header className='header'>
        <div className=''>
          {/* <div className='flex align-right'>
            <button className={(locale === 'es') ? 'font-semibold' : ''} name='es' onClick={changeLocale}>Español</button>
            &nbsp;|&nbsp;
            <button className={(locale === 'en') ? 'font-semibold' : ''} name='en' onClick={changeLocale}>English</button>
          </div> */}
          <div className='flex justify-end pt-2 pr-10'>
            <select value={locale} onChange={handleChange} className='bg-[#313131] h-15 w-15'>
              <option value='en'>English</option>
              <option value='es'>Español</option>
            </select>
          </div>

        </div>
      </header>

      <div className="max-w-xl m-auto">
        {props.children}
      </div>
    </>
  )
}

export default Layout
