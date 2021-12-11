import { Controller, Get, Path, Route } from 'tsoa';

// STUB: to replace

@Route('/sample')
export class SampleController extends Controller {
	/**
	 * retrieve a sample number
	 *
	 * @param sample sample sumber
	 * @returns sample number
	 */
	@Get('/{sample}')
	public async getSample(
		@Path() sample: number
	): Promise<{ sample: number }> {
		return Promise.resolve({ sample: sample });
	}
}
