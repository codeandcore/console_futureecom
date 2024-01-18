//TODO: Remove this import after Node's upgrade to >16.0.0
import 'core-js/features/array/at'
//@ts-expect-error TODO: Remove this import after Node's upgrade to >15.0.0
import replaceAllInserter from 'string.prototype.replaceall'

replaceAllInserter.shim()
global.Image = window.Image
location.replace(`http://localhost`)
