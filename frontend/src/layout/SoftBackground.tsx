export function SoftBackground() {
  return (
    <div className="soft-background" aria-hidden="true">
      <svg className="soft-wave-graph" viewBox="0 0 1440 520" preserveAspectRatio="none">
        <path
          className="soft-wave soft-wave-back"
          d="M-40 322 C120 270 218 268 360 304 S620 380 760 320 S1030 222 1178 258 S1368 334 1480 286"
        />
        <path
          className="soft-wave soft-wave-front"
          d="M-60 358 C96 398 206 404 336 372 S598 292 744 326 S1034 430 1188 390 S1368 278 1500 306"
        />
      </svg>
      <div className="soft-wash wash-a" />
      <div className="soft-wash wash-b" />
      <div className="grain-layer" />
    </div>
  );
}
