import { takeEvery } from 'redux-saga'
import { select } from 'redux-saga/effects'
import R from 'ramda'

import { MAP_LOADED } from 'core/frontend/client/map/map-actions'
import { getMap } from 'core/frontend/plugin/api'

function* setColorProperty() {
  const layersConfig = yield select(state => state.pluginConfigs.coloredLayer.layers)
  if (R.isNil(layersConfig)) return

  const map = getMap()

  layersConfig.forEach((layerConfig) => {
    const { layerKey, property } = layerConfig
    map.setPaintProperty(layerKey,
      'fill-color', {
        property,
        type: 'categorical',
        stops: (layerConfig.colors || []).map(colorConfig => [colorConfig.value, colorConfig.color])
      })
  })
}

export default function* saga() {
  yield [
    takeEvery(MAP_LOADED, setColorProperty)
  ]
}
