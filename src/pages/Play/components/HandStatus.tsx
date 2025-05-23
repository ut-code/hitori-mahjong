type HandStatusProps = {
	mentsuSyanten: number;
	toitsuSyanten: number;
};

function HandStatus(props: HandStatusProps) {
	return (
		<div className="h-full flex flex-col gap-4 rounded-[1rem] shadow-md">
			<div className="pt-4 font-medium pl-4 text-2xl text-left">向聴数</div>
			<div className="font-medium pl-6 text-left text-xl leading-normal">
				{props.mentsuSyanten === 0 ? (
					<>メンツ手: テンパイ</>
				) : (
					<>メンツ手: {props.mentsuSyanten}シャンテン</>
				)}
				<br />
				{props.toitsuSyanten === 0 ? (
					<>七対子: テンパイ</>
				) : (
					<>七対子: {props.toitsuSyanten}シャンテン</>
				)}
			</div>
		</div>
	);
}

export default HandStatus;
