import ErrorDetails from './ErrorDetails';

interface FailureCallback {
  (error:ErrorDetails): void;
}

export default FailureCallback;
