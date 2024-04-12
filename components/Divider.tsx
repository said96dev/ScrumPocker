import React from 'react'
type DividerProps = {
    title: string;
}
const Divider = ({ title }: DividerProps) => {
    return (
        <div >
            <div className="flex flex-col w-full border-opacity-50">
                <div className="divider divider-info mt-0 mb-0">{title}</div>
            </div>
        </div>

    )
}

export default Divider