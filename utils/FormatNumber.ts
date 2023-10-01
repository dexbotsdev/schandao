import Big, { BigSource } from 'big.js';
import { isNaN, isNil } from 'lodash';
import prettyNum, {PRECISION_SETTING,ROUNDING_MODE} from 'pretty-num';
import   moment, { duration } from 'moment';

export function formatWithPrecision(
  precision: number,
  number: number,
  precisionSettingInput?: number
) {
  if (isNil(number) || isNaN(number)) return '';

  const precisionSetting =
    precisionSettingInput ??
    (number < 1
      ? PRECISION_SETTING.REDUCE_SIGNIFICANT
      : PRECISION_SETTING.FIXED);

  return prettyNum(number, {
    precision,
    precisionSetting,
    roundingMode: ROUNDING_MODE.DOWN,
    thousandsSeparator: ',',
  });
}

export const formatTokenAmount = (num: number) => formatWithPrecision(3, num);
export const formatWithoutDecimals = (num: number) =>
  formatWithPrecision(0, num);

export const formatTokenAmountCompact = (num: number) =>
  formatWithPrecision(2, num, num % 1 === 0 ? 0 : undefined);

export const formatMzrAmount = (num: number | string) => {
  if (isNil(num) || isNaN(+num)) return '';

  return prettyNum(Big(num).toNumber(), {
    precision: 1,
    precisionSetting: PRECISION_SETTING.REDUCE_SIGNIFICANT,
    roundingMode: ROUNDING_MODE.DOWN,
    thousandsSeparator: ',',
  });
};

export const formatUSDAmount = (num: number | string) => {
  if (isNil(num) || isNaN(num)) return '';

  return prettyNum(Big(num).toNumber(), {
    precision: 2,
    precisionSetting: PRECISION_SETTING.FIXED,
    roundingMode: ROUNDING_MODE.DOWN,
    thousandsSeparator: ',',
  });
};

export function valueAsSafeNumber(val: string | undefined) {
  if (isNil(val) || val === '' || isNaN(+val)) {
    return undefined;
  }

  return Big(val).round(10, Big.roundDown).toNumber();
}

const defaultSuffixes = ['', '', 'M', 'B', 'T', 'Q', 'Qu', 'S', 'O', 'N', 'D']; // Add more suffixes as needed
export const allSuffixes = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Q',
  'Qu',
  'S',
  'O',
  'N',
  'D',
];

type FormatOptions = {
  suffixes?: string[];
  precision?: number;
};
export function formatNumberWithSuffix(
  number: BigSource,
  { suffixes = defaultSuffixes, precision = 4 }: FormatOptions = {}
): string {
  const nr = Big(number);
  if (nr.eq(0)) return '0';

  return nr.abs().gte(1)
    ? formatLargeNumber(nr.toNumber(), { precision, suffixes })
    : formatSmallNumber(nr.toNumber(), { precision, suffixes });
}

function formatLargeNumber(
  number: number,
  { suffixes, precision }: Required<FormatOptions>
) {
  const numAbs = Math.abs(number);
  const sign = Math.sign(number);
  let formattedNumber = formatWithPrecision(precision, numAbs);

  const suffixIndex = Math.floor(Math.log10(numAbs) / 3);
  const suffix = suffixes[suffixIndex];

  if (suffix) {
    const divisor = Math.pow(10, suffixIndex * 3);
    const abbreviatedNumber = numAbs / divisor;
    formattedNumber = abbreviatedNumber.toFixed(1);
  }

  return `${sign === -1 ? '-' : ''}${formattedNumber}${suffix || ''}`;
}

const normalToSubscript = {
  0: '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

export const subscriptNumbers = Object.values(normalToSubscript);

function formatSmallNumber(
  number: number,
  { precision }: Required<FormatOptions>
): string {
  const numberString = Big(number).toFixed(21);
  let index = numberString.indexOf('.') + 1;
  while (numberString[index] === '0') {
    index++;
  }

  const base = index - numberString.indexOf('.') - 1;

  if (base <= 3) {
    return formatWithPrecision(precision, number);
  }

  const baseSubscript = [...base.toString()]
    .map((char) => normalToSubscript[char as keyof typeof normalToSubscript])
    .join('');
  const numberSubscript = [...numberString.slice(index)].join('');

  const nr = Big(`0.${numberSubscript}`)
    .toFixed(precision, Big.roundDown)
    .toString()
    .slice(2);
  const newNotation = `0.0${baseSubscript}${nr}`;

  return newNotation;
}



export function toOnchainTokenAmount(amount: BigSource, decimals: number) {
  return BigInt(Big(amount).times(Big(10).pow(decimals)).toFixed());
}

export function fromOnchainTokenAmount(
  amount: BigSource | bigint,
  decimals: number
) {
  return Big(amount.toString()).div(Big(10).pow(decimals));
}

export function toOnchainMzrTokenAmount(amount: BigSource) {
  return BigInt(Big(amount).times(Big(10).pow(18)).toFixed());
}
export function fromOnchainMzrTokenAmount(amount: BigSource | bigint) {
  return Big(amount.toString()).div(Big(10).pow(18));
}

export function fromWei(value: string) {
  return Big(value).div(Big(10).pow(18)).toNumber();
}
export function weiToGwei(value: BigSource) {
  return Big(value).div(Big(10).pow(9)).toNumber();
}

export function formatWagmiError(error: Error) {
  if ('reason' in error && typeof error.reason === 'string') {
    return error.reason;
  }
  if ('shortMessage' in error && typeof error.shortMessage === 'string') {
    return error.shortMessage;
  }
  return error.message;
}

export function formatAddress(address: string, size = 4) {
  return address.slice(0, size + 2) + '...' + address.slice(-size);
}

 
export function toBase64(text: string) {
  return Buffer.from(text).toString('base64');
}
export function fromBase64(text: string) {
  return Buffer.from(text, 'base64').toString('utf-8');
}

export const formatDuration = (
  date: string,
  options: FormatDurationOptions = {}
) => {
  const dur = duration(moment(options.finishDate).diff(moment(date)));

  return formatMomentDuration(dur, options);
};


type FormatDurationOptions = {
  startWith?: 'm' | 's';
  finishDate?: string;
  maxBlocks?: number;
};

export function formatMomentDuration(
  dur: moment.Duration,
  { startWith = 'm', maxBlocks = 3 }: FormatDurationOptions = {}
) {
  const years = dur.years();
  const months = dur.months();
  const days = dur.days();
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  const differenceString = [];

  if (years > 0 && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(years)}Y`);
  }

  if (months > 0 && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(months)}M`);
  }

  if (days > 0 && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(days)}d`);
  }

  if (hours > 0 && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(hours)}h`);
  }

  if (minutes > 0 && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(minutes)}m`);
  }

  if (seconds > 0 && startWith === 's' && differenceString.length < maxBlocks) {
    differenceString.push(`${Math.abs(seconds)}s`);
  }

  return differenceString.join(' ');
}
