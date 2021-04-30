import React from 'react';

interface IProps {
  onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;
}
function Industry({ onMouseDown }: IProps) {
  return (
    <div
      data-type="industry"
      onMouseDown={onMouseDown}
      className="min-w-250 min-h-50 my-4 rounded-2xl text-indigo-500 bg-indigo-100 flex items-center justify-center"
    >
      XXX产业
    </div>
  );
}

export default Industry;
