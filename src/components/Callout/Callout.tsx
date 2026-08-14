import "./Callout.css";

type CalloutProps = {
  children: string;
};

export function Callout({ children }: CalloutProps) {
  return (
    <aside className="callout">
      <p className="callout-text">
        <span className="callout-quote">“</span>
        {children}”
      </p>
    </aside>
  );
}
