import getNightModel from '@/utils/ui/nightModel'

export default {
	namespaced: true,
	state: {
		isHome: '',
		familyTab: 'receive',
		scriptFormFinishCount: 0,
		isNightModel:getNightModel()
	},
	mutations: {
		home(state, isHome) {
			state.isHome = isHome
		},
		setFamilyTab(state, tab) {
			state.familyTab = tab
		},
		finishScriptForm(state, { isFinish,id }) {
			const n = isFinish ? 0 : -1
			if (n === -1 && state.scriptFormFinishCount === 0) {
				return
			}
			if (n === 0 && state.scriptFormFinishCount === 3) {
				return
			}
			if (state.scriptFormFinishCount >= id && n === 0) {
				return
			}
			state.scriptFormFinishCount = id + n
		},
		finishFormCountToZero(state) {
			state.scriptFormFinishCount = 0
		},
		switchNightModel(state) {
			let night = sessionStorage.getItem('night') || '0'
			if (night === '0') {
				state.isNightModel = true
				sessionStorage.setItem('night', '1')
			} else {
				state.isNightModel = false
				sessionStorage.setItem('night', '0')
			}
		}
	}
}
