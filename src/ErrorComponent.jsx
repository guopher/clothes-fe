import './ErrorComponent.css'
import { BE_REPO, BUG_FORM, FE_REPO } from './strings'

const findError = 'Maybe you can find the bug in my GitHub 👇'
const backendTech = 'Python, Flask, some GPT technologies later 😎'
const frontendTech = 'React, JavaScript, HTML, CSS'

const ErrorComponent = () => {
  return (
      <div className='error-component'>
        <div className='error-container'>
          <img className='error-img' src={require('./img/dog.jpeg')} alt='dog' />
          <div className='error-msg'>
            Uh Oh 😢
            <br></br>
            <div style={{ fontSize: '20px', marginTop: '10px'}}>
              Something wrong went on our end
            </div>
          </div>
        </div>
        <div className='error-action-item'>
          Please file a bug <a href={BUG_FORM} target='_blank'>here</a>. {findError}
        </div>
        <ul>
          <li className='error-description'>Front end <a href={FE_REPO} target='_blank'>code </a>({frontendTech})</li>
          <li className='error-description'>Back end <a href={BE_REPO} target='_blank'>code </a>({backendTech})</li>
        </ul>
      </div>
  )
}

export default ErrorComponent