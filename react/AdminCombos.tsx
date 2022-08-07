import React, { FC, useEffect, useState } from 'react'
import {
  Layout,
  PageBlock,
  Table,
  ToastProvider,
  ToastConsumer,
} from 'vtex.styleguide'
import { defaultSchema } from './utils/defaultSchema'
// @ts-ignore
import { getData, updateComboAvailability } from './services/api'

interface Combo {
  amount: number
  items: string[]
  id: string
  comboId: string
  comboProductId: string
  prodOneId: number
  prodOneName: string
  prodTwoId: number
  prodTwoName: string
  available: boolean
  message: string
}
const AdminCombo: FC = () => {
  const [loading, setLoading] = useState(true)
  const [combinations, setCombinations] = useState<Combo[]>([])
  const [error, setError] = useState(false)

  const bootstrap = async () => {
    const data = await getData()
    console.log('Request', data)
    if (data === 'SERVER ERROR') {
      setError(true)
    } else {
      console.log('Dados dos Combos: ', data)
      data.map((combo: Combo) => {
        combo.comboId = combo.id
        combo.message = combo.available ? 'Ativado' : 'Desativado'
      })
      setCombinations(data)
    }

    setLoading(false)
  }
  // const [sortedBy, setSortedtBy] = useState<String>("name");
  // const [sortedOrder, setSortedOrder] = useState<String>("ASC");

  useEffect(() => {
    bootstrap();
  }, [loading])

  if (error) {
    return (
      <Layout>
        <PageBlock title="Combos" variation="full">
          <div className="error">
            <h1>Algo inesperado aconteceu, tente novamente</h1>
          </div>
        </PageBlock>
      </Layout>
    )
  }

  async function updateCombo(combos: Combo[], showToast: (message: string) => void) {
    console.log('Combos Selecionados: ', combos)
    const combosId = combos.map(combo => combo.comboId)
    console.log('Combos ID: ', combosId)
    setLoading(true)
    await updateComboAvailability(combosId)
      .then(() => {
        showToast("Combo(s) Atualizado(s) com sucesso!");
        // bootstrap();
      })
      .catch(() => {
        setError(true)
        showToast("Erro: Não foi possível atualizar o(s) combo(s) no momento!");
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <ToastProvider positioning="window">
      <Layout>
        <ToastConsumer>
          {({ showToast }: any) => (
            <PageBlock
              title="Combos"
              subtitle="Lista de combos"
              variation="full"
            >
              <Table
                fullWidth
                schema={defaultSchema}
                items={combinations}
                loading={loading}
                density="high"
                emptyStateLabel="Não existem combos cadastrados!"
                bulkActions={{
                  onChange: () => {},
                  main: {
                    label: 'Ativar/Desativar Combo(s) Selecionado(s)',
                    handleCallback: async (params: any) => {
                     updateCombo(params.selectedRows, showToast)
                    },
                  },
                }}
              />
            </PageBlock>
          )}
        </ToastConsumer>
      </Layout>
    </ToastProvider>
  )
}
export default AdminCombo
