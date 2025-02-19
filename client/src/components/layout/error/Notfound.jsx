// src/pages/NotFound.js
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <main>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="text-center mt-4">
                <img
                  className="mb-4 img-error"
                  src={`${process.env.PUBLIC_URL}/error/error-404-monochrome.svg`}
                  alt="404 Error"
                />

                <p class="lead">
                  This requested URL was not found on this server.
                </p>
                <a href="index.html">
                  <i class="fas fa-arrow-left me-1"></i>
                  Return to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
