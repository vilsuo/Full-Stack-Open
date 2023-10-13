interface ErrorProps { message: string | null; }

const ErrorMessage = (props: ErrorProps) => {
  if (!props.message) return null;

  return (
    <p style={{ color: 'red' }}>{props.message}</p>
  );
};

export default ErrorMessage;