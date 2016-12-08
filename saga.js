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
    const colorFunc = {
      property,
      type: 'categorical',
      stops: (layerConfig.colors || []).map(colorConfig => [colorConfig.value, colorConfig.color])
    }

    map.setPaintProperty(layerKey, 'fill-color', colorFunc)
    // todo update mapbox gl
    // https://github.com/mapbox/mapbox-gl-js/pull/3033
    // map.setPaintProperty(`${layerKey}-border`, 'line-color', colorFunc)
  })
}

export default function* saga() {
  yield [
    takeEvery(MAP_LOADED, setColorProperty)
  ]
}
