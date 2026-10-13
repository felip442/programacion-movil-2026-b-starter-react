// Ejercicio Kotlin · Parte 4 del TODO.md
//
// Alcance: solo lo visto en la semana 7 (val/var, funciones, clases, tipos que admiten null,
// `?.`, `?:`, if/when, plantillas de cadena). No exige proyecto Android.
// Cómo ejecutarlo: pegue el archivo en https://play.kotlinlang.org o compílelo con `kotlinc`.

// id, nombre y categoría no cambian (val); precio y stock sí pueden cambiar (var).
// stock es Int? porque puede no conocerse (null).
class Product(
    val id: Int,
    val name: String,
    var price: Double,
    val category: String,
    var stock: Int?
)

// null → "Sin dato" · 0 → "Agotado" · menos de 5 → "Pocas unidades" · otro caso → "Disponible"
fun stockLabel(stock: Int?): String {
    if (stock == null) return "Sin dato"
    return when {
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

// Precio con el descuento aplicado: 10000.0 con 15 % → 8500.0
fun applyDiscount(price: Double, percent: Int): Double {
    return price - price * percent / 100.0
}

fun main() {
    val products = listOf(
        Product(1, "Agua mineral 600 ml", 1800.0, "Bebidas", 120),
        Product(2, "Galletas de avena x6", 2700.0, "Snacks", 0),
        Product(3, "Jabón de manos 250 ml", 6900.0, "Aseo", null)
    )

    for (product in products) {
        val stockText = product.stock?.toString() ?: "?"
        val finalPrice = applyDiscount(product.price, 10)
        println("${product.name} | stock: $stockText (${stockLabel(product.stock)}) | precio con 10 %: $finalPrice")
    }
}
