<template>
    <div id="modal" v-if="!pseudo" class="top-0 left-0 absolute w-full h-full bg-gray-600/75">
        <div class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-50 p-4">
            <div class="relative w-full max-w-md max-h-full">
                <div class="relative rounded-lg shadow bg-gray-700">
                    <div class="px-6 py-6 lg:px-8">
                        <h3 class="mb-4 text-xl font-medium text-white">Choisir un pseudo</h3>
                        <div class="space-y-6">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-white">Pseudo</label>
                                <input type="text" v-model="temporaryPseudo" @keypress.enter="savePseudo"
                                    class="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                                    placeholder="pseudo" required>
                            </div>
                            <button type="button" @click="savePseudo"
                                class="w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm text-center hover:bg-blue-700 focus:ring-blue-800 px-5 py-2.5">
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>