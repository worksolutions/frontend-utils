export type MatchStringStart<Candidate extends string, Pattern extends string> =
	Candidate extends `${Pattern}${infer _}`
		? true : false;
