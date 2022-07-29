import {describe, it, expect} from "vitest";
import App from "./App";
import {render, screen} from "./utils/test-utils";

describe("test test", () => {
	it("vite + react", () => {
		render(<App />);
		expect(screen.getByText("Vite + React")).toBeInTheDocument();
	});
});
