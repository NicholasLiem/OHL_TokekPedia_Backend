# Seleksi Asisten Labpro - Single Service
## **Author**
Nicholas Liem - 13521135

## **How to Run The Program**
1. Clone this repository
```sh
https://github.com/NicholasLiem/SingleService.git
```
2. Change the current directory to `SingleService` folder
```sh
cd SingleService
```
3. Build and run your docker containers
```sh
docker-compose up --build
```
## **Design Patterns**
1. Model-Controller Pattern (Architectural) <br>
Secara struktur, backend service ini memiliki tiga buah model, yakni barang, perusahaan, dan user. Masing-masing dari model ini memiliki controller-nya masing-masing. Perlu diperhatikan bahwa karena ini adalah backend service jadi tidak ada view. Hal ini mempermudah pengaturan model-model dalam satu handler/controllernya masing-masing sehingga kode jadi lebih reusable.
2. Repository Pattern <br>
Model yang dibentuk diatur dan disimpan oleh ORM untuk diolah lebih mudah. Dalam hal ini, TypeORM menyediakan data source dan dari data source ini terdapat beberapa repository yang dibuat dari model yang ada. Kegunaan dari pattern ini adalah untuk menjaga abstraksi data dan menyentralisir data.
3. Chain of Responsibility Pattern (Behavioral Design) <br>
Pattern ini secara spesifik digunakan untuk melakukan penjagaan route api dengan memanggil fungsi checkToken yang akan memeriksa token dari header Authorization apakah valid atau tidak dan melanjutkan aksi selanjutnya kepada api yang ingin diakses. Jadi, alasan penggunaan pattern ini adalah untuk menjaga routing api melalui aksi linear tersebut.
4. Singleton Pattern <br>
Pada saat aplikasi dijalankan, pada route, masing-masing kelas controller dipanggil dan diinjeksi dengan data source yang telah diload. Masing-masing controller ini hanya dipanggil satu kali.

## **Endpoints**
| Endpoint             | Method   | Description                                        |
|----------------------|----------|----------------------------------------------------|
| /login               | POST     | Login verification                                 |
| /self                | GET      | Get session status                                 |
| /barang              | GET      | Get a list of barang registered based on query     |
| /barang/:id          | GET      | Get the detail of barang of the given id           |
| /barang              | POST     | Create a new barang                                |
| /barang/:id          | PUT      | Update the detail of a barang of the given id      |
| /barang/:id          | DELETE   | Delete barang of the given id                      |
| /perusahaan          | GET      | Get a list of perusahaan registered based on query |
| /perusahaan/:id      | GET      | Get the detail of perusahaan of the given id       |
| /perusahaan          | POST     | Create a perusahaan                                |
| /perusahaan/:id      | PUT      | Update the detail of perusahaan of the given id    |
| /perusahaan/:id      | DELETE   | Delete perusahaan of the given id                  |


## **Tech Stack**
TypeScript, PostgresSQL, TypeORM, ExpressJS

## **SOLID**
1. Single Responsibility Principle <br>
Setiap kelas/model yang dibuat memiliki satu buah controller yang hanya mengatur. Tidak ada controller yang mengatur barang atau perusahaan secara bersamaan, ex: tidak ada controller yang dapat membuat perusahaan sekaligus membuat barang juga. Selain itu, ada pembagian modul, misalnya seperti controller, middleware, dan sebagainya mereka terpisah dan tidak dalam satu tempat.

2. Open Closed Principle <br>
OCP digunakan pada bagian reponse util dimana untuk setiap response dibagi apakah error atau success dan ada beberapa tipe struktur data khusus seperti barang yang responsenya unik dari response biasa sehingga ditambahkan beberapa fungsi untuk memfasilitasi kebutuhan tersebut sehingga tidak perlu mengubah reponse/data sumber, tetapi menyesuaikan dan menambahkan.

3. Liskov Substitution Principle <br>
Tidak ada inheritence yang digunakan dalam repository ini.

4. Interface Segregation <br>
Setiap controller mengimplementasi method-method yang diperlukan untuk fungsionalitasnya. Tidak ada controller yang dipaksa untuk mengimplementasi method-method yang tidak diperlukan.

5. Dependency Injection <br>
Injeksi data source ke dalam controllernya masing-masing yang mengatur sebuah atau beberapa repository.

## **Bonus Report**
| Features                                               | Yes      | No |
|--------------------------------------------------------|----------|----|
| B02 - Deployment                                       | &check;  |    |
| B03 - Single Service Implementation                    | &check;  |    |
| B07 - Dokumentasi API (Swagger)                        | &check;  |    |
| B08 - SOLID                                            | &check;  |    |

## **Extras**
- This is a link to the swagger api docs: 
- This is a link to the monolith repository [click here!](https://github.com/NicholasLiem/OHL_Monolith)
- Amazon EC2 service is used for this backend service and am using Neon.Tech service to deploy my PostgresSQL server. You can interact with the API through this public IPv4 address: