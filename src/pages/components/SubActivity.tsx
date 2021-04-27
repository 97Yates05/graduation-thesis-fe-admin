import React from 'react';

interface IProps {
  onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;
}
function SubActivity({ onMouseDown }: IProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="relative min-w-250 min-h-80 my-4 border-solid border-2 border-blue-300 rounded-md"
      data-type="sub-activity"
    >
      <span className="inline w-24 text-center text-lg bg-white text-blue-300 absolute -top-3.5 m-auto left-0 right-0">
        XXX子活动
      </span>
    </div>
  );
}

export default SubActivity;
