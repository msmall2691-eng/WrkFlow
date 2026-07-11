/*
  CountUp — despite the name, this no longer animates. It used to count up
  from 0 on scroll-into-view as a cosmetic flourish, but for a trust-critical
  number like a price, ANY window where the wrong figure is visible is a real
  defect, not a nice-to-have risk: a screenshot, a quick scroll past at
  normal speed, or a page load that renders before the animation settles
  could all catch a transient wrong number ($0 during the original bug,
  then a partial mid-count value like $312 instead of $399 after that fix).
  This is now a plain, always-correct static number — same props/formatting
  as before so callers don't need to change.
*/
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  /** Kept for prior callers; the count-up animation no longer exists. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
