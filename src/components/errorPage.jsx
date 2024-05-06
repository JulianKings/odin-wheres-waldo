import { useRouteError } from "react-router-dom";
import '../style/errorPage.css'
import errorImage from '../assets/error.webp'

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <div className="error-container">
        <img src={errorImage} />
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}