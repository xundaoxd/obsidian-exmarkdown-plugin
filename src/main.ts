import { Plugin, MarkdownPostProcessorContext } from 'obsidian'

import Viz from '@viz-js/viz'
import { Transformer } from 'markmap-lib';
import { Markmap, loadCSS } from 'markmap-view'

export default class ExMarkdown extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor('dot', this.dotRender.bind(this))
		this.registerMarkdownCodeBlockProcessor('markmap', this.markmapRender.bind(this))
	}

	async dotRender(source: string, el: HTMLElement, _: MarkdownPostProcessorContext): Promise<void> {
		try {
			let viz = await Viz.instance()
			el.appendChild(viz.renderSVGElement(source))
		} catch (err) {
			el.createEl('span', { text: err.message })
		}
	}
	async markmapRender(source: string, el: HTMLElement, _: MarkdownPostProcessorContext): Promise<void> {
		let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		el.appendChild(svg)
		setImmediate(() => {
			const transformer = new Transformer();
			const { root, features } = transformer.transform(source);
			const { styles } = transformer.getUsedAssets(features);
			if (styles) loadCSS(styles);
			Markmap.create(svg, undefined, root);
		})
	}
}
