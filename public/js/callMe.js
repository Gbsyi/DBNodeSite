var callMeModal = document.getElementById('callMeModal')
var callMeInput = document.getElementById('callMeInput')

callMeModal.addEventListener('shown.bs.modal', function () {
  callMeInput.focus()
})
