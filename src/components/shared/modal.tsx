interface ModalProps {
  open: boolean;
  onConfirm?: () => void;
  title?: string;
  btns?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Modal({ open, onConfirm, title, btns, children }: ModalProps) {
  return open ? (
    <div className='modal_wrap'>
      <div className='modal_area'>
        {title && (
          <div className='md_tit'>
            <p>{title}</p>
          </div>
        )}
        <div className='md_cont'>{children}</div>
        <div className='md_btns'>
          {onConfirm && (
            <button type='button' className='btn sm' onClick={onConfirm}>
              확인
            </button>
          )}
          {btns}
        </div>
      </div>
    </div>
  ) : null;
}
