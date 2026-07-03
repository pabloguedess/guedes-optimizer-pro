export default function NotificationToast({ notifications }) {
  if (!notifications.length) return null;

  return (
    <div className="notificationArea">
      {notifications.map((item) => (
        <div className="notificationToast" key={item.id}>
          <strong>{item.title}</strong>
          <p>{item.message}</p>
        </div>
      ))}
    </div>
  );
}