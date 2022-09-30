export default function FilterIcon(props: { className?: string }) {
  return (
    <>
      <span className="sr-only">Filters</span>
      <svg
        {...props}
        viewBox="0 0 22 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line y1="1" x2="22" y2="1" stroke="#7D7D7D" strokeWidth="2" />
        <line
          x1="2.93359"
          y1="8.20001"
          x2="19.8003"
          y2="8.20001"
          stroke="#7D7D7D"
          strokeWidth="2"
        />
        <line
          x1="5.86719"
          y1="15.4"
          x2="16.1339"
          y2="15.4"
          stroke="#7D7D7D"
          strokeWidth="2"
        />
      </svg>
    </>
  );
}
