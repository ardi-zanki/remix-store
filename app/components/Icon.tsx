import {twMerge} from 'tailwind-merge';

type IconName =
  | 'bag'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'filter'
  | 'globe'
  | 'info'
  | 'minus'
  | 'moon'
  | 'plus'
  | 'tag'
  | 'trash'
  | 'x';

export type IconProps = React.SVGProps<SVGElement> & {name: IconName};
export default function Icon({name, className}: IconProps) {
  return (
    <svg className={twMerge('size-6 text-black', className)} aria-hidden>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
