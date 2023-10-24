import styles from './squoolr-v2-auth-ui.module.css';

/* eslint-disable-next-line */
export interface SquoolrV2AuthUiProps {}

export function SquoolrV2AuthUi(props: SquoolrV2AuthUiProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to SquoolrV2AuthUi!</h1>
    </div>
  );
}

export default SquoolrV2AuthUi;
