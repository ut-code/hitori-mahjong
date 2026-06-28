export type Hai =
	| {
			kind: SuhaiKind;
			value: number;
	  }
	| {
			kind: "jihai";
			value: JihaiValue;
	  };

export type SuhaiKind = "manzu" | "pinzu" | "souzu";
export type HaiKind = SuhaiKind | "jihai";

export type HaiWithID = {
	kind: HaiKind;
	value: JihaiValue | number;
	id: number;
};

export type JihaiValue =
	| "ton"
	| "nan"
	| "sya"
	| "pei"
	| "haku"
	| "hatsu"
	| "tyun";
