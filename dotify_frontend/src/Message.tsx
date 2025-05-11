function Message({ message }: { message: string }) {
  return (
    <div className="message">
      <p>{message}</p>
    </div>
  );
}

export default Message;