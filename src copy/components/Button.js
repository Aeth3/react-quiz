export default function Button({ children, dispatch, type, className}) {
  return (
    <button className={className} onClick={() => dispatch(type)}>
      {children}
    </button>
  );
}
