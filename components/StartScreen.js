export default function StartScreen({ onContinue }) {
  return (
    <main
      className="screen start"
      onClick={onContinue}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onContinue();
      }}
      tabIndex={0}
    >
      <h1 className="text-title start-logo">
        W<span className="start-ear">ear</span>by
      </h1>
      <img
        className="start-character"
        src="/character/ear.svg"
        alt="Ear, a gray character with two antennae"
      />
    </main>
  );
}