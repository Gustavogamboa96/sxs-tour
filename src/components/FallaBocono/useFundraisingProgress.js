import { useMemo, useSyncExternalStore } from 'react';
import {
  getFundraisingProgress,
  getFundraisingVersion,
  subscribeFundraising,
} from '../../config/fallaBoconoConfig';

export default function useFundraisingProgress() {
  const version = useSyncExternalStore(subscribeFundraising, getFundraisingVersion, getFundraisingVersion);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getFundraisingProgress(), [version]);
}
