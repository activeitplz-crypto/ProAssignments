import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="font-headline text-2xl font-bold">Janzy</span>
    </Link>
  );
}
