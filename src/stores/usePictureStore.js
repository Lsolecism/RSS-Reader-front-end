import { defineStore } from 'pinia'

export const usePictureStore = defineStore('Picture', {
    state: () => ({
        items: [
            { src: 'src/assets/diygod.png', alt: 'Image 1',link:'https://diygod.cc/',content: { title: '内容1', description: '这是内容1的描述' }},
            { src: 'src/assets/idol.png', alt: 'Image 2',link:'https://baike.baidu.com/item/%E4%BA%9A%E4%BC%A6%C2%B7%E6%96%AF%E6%B2%83%E8%8C%A8?fromModule=lemma_search-box',content: { title: '内容2', description: '这是内容2的描述' } },
            { src: 'src/assets/rss-hub.png', alt: 'Image 3',link:'https://docs.rsshub.app/' ,content: { title: '内容3', description: '这是内容3的描述' }},
            { src: 'src/assets/robotcat.png', alt: 'Image 4',link:'https://dora-world.com/',content: { title: '内容4', description: '这是内容4的描述' }}
        ]
    }),
})
