import { defineStore } from 'pinia'

export const useCarrinhoStore = defineStore('cartStore', {
  state: () => ({
    itens: []
  }),
  getters: {
    totalItens: (state) => state.itens.reduce((acc, i) => acc + i.quantidade, 0),
    valorTotal: (state) => state.itens.reduce((acc, i) => acc + (i.preco * i.quantidade), 0)
  },
  actions: {
    adicionarItem(produto) {
      const item = this.itens.find(i => i.id === produto.id)
      item ? item.quantidade++ : this.itens.push({ ...produto, quantidade: 1 })
    },
    atualizarQuantidade(id, qtd) {
      const item = this.itens.find(i => i.id === id)
      if (item) {
        item.quantidade = qtd
        if (item.quantidade <= 0) this.removerItem(id)
      }
    },
    removerItem(id) {
      this.itens = this.itens.filter(i => i.id !== id)
    },
    limparCarrinho() {
      this.itens = []
    }
  }
})