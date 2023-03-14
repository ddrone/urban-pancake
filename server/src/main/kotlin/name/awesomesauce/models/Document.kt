package name.awesomesauce.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class Document(
    val name: String,
    val content: JsonElement
)
