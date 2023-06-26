import { Plugin } from 'obsidian'

import Viz from '@viz-js/viz'

export default class ExMarkdown extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor('dot', this.dotRender.bind(this))
	}

	async dotRender(source, el): Promise<void> {
		try {
			let viz = await Viz.instance()
			el.appendChild(viz.renderSVGElement(source))
		} catch (err) {
			el.createEl('span', { text: err.message })
		}
	}
}
