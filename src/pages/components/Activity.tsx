import React from 'react';

interface IProps {
  onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;
}
function Activity({ onMouseDown }: IProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative min-w-250 min-h-100 my-4 border-solid border-2 border-green-300 rounded-md"
      data-type="activity"
    >
      <span className="inline w-24 text-center text-xl bg-white text-green-300 absolute -top-3.5 m-auto left-0 right-0">
        XXX活动
      </span>
    </div>
  );
}

export default Activity;
