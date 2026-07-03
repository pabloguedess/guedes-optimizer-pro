export default function TitleBar() {
  return (
    <div className="titlebar">
      <div className="windowButtons">
        <button className="windowBtn close" onClick={() => window.optimizer.fechar()} />
        <button className="windowBtn minimize" onClick={() => window.optimizer.minimizar()} />
        <button className="windowBtn maximize" onClick={() => window.optimizer.maximizar()} />
      </div>

      <div className="titleText">Guedes Optimizer PRO v2.0</div>
    </div>
  );
}