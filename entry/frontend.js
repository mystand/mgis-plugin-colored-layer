import R from 'ramda'

import saga from '../saga'

function buildFieldsOptions(formOptions) {
  const { values, fieldPath, directories: { layers } } = formOptions
  const sourceLayerKeyFieldPath = [fieldPath[0], fieldPath[1], 'layerKey']
  const sourceLayerKeyValue = R.path(sourceLayerKeyFieldPath, values)

  if (R.isNil(sourceLayerKeyValue)) return []

  const attributes = R.find(x => x.key === sourceLayerKeyValue, layers).attributes
  return R.keys(attributes).map(key => ({ value: key, label: attributes[key].label }))
}

function buildLayersOptions(formOptions) {
  const { directories: { layers } } = formOptions
  return layers.filter(layer => layer.geometry_type === 'polygon')
    .map(layer => ({ value: layer.key, label: layer.name }))
}

export default {
  form: {
    fields: [
      {
        key: 'layers',
        label: 'Слои',
        input: 'array',
        item: {
          fields: [
            {
              key: 'layerKey',
              label: 'Слой (только полигоны)',
              input: 'select',
              inputOptions: { options: buildLayersOptions }
            },
            { key: 'property', label: 'Поле', input: 'select', inputOptions: { options: buildFieldsOptions } },
            {
              key: 'colors',
              label: 'Раскраска',
              input: 'array',
              item: {
                fields: [
                  { key: 'value', label: 'Значение', input: 'string' },
                  { key: 'color', label: 'Цвет', input: 'color' }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  saga
}
