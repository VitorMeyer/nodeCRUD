import { DataProvider, fetchUtils } from "react-admin";

const API_URL ="http://localhost:3001"

export const dataProvider:DataProvider ={


    getList: async (resource, params) => {
        const { pagination, sort, filter } = params;
        const { page, perPage } = pagination;
        const { field, order } = sort;

        try {
            // Construa a URL com os parâmetros de paginação, ordenação e filtro
            const url = `${API_URL}/${resource}?_page=${page}&_limit=${perPage}&_sort=${field}:${order}&${Object.entries(filter).map(([key, value]) => `${key}=${value}`).join('&')}`;

            // Faça a chamada para obter a lista de recursos
            const response = await fetchUtils.fetchJson(url);
            console.log(response, "response get list");
            // Transforme a resposta em JSON
            const responseData = await response.json
            

            const totalPlans = responseData.totalCount;
            const data = responseData.data
            
            console.log(totalPlans, "total de itens");
            // Retorna os dados da lista de recursos e o total de recursos disponíveis
            return {
                data: data,
                total: totalPlans   // parseInt(response.headers.get("x-total-count") || '0', 10)
            };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao obter lista de recursos: ' + error);
        }
    },
    getOne: async (resource, params)=>{
        const response = await fetchUtils.fetchJson(
            `${API_URL}/${resource}/${params.id}`
            
        )
        console.log(response.json);
        const data = await response.json
        //const mappedData = { ...data, id: data._id };
        return {data: data}
    },
    getMany: async (resource, params) => {
        const { ids } = params;

        try {
            // Construa a URL para a consulta
            const url = `${API_URL}/${resource}?${ids.map(id => `id=${id}`).join('&')}`;

            // Faça a chamada para buscar os registros com os IDs fornecidos
            const response = await fetchUtils.fetchJson(url);

            // Transforme a resposta em JSON
            const data = await response.json();

            // Retorna os dados encontrados
            return { data };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao buscar vários registros: ' + error);
        }
    },
    getManyReference: async (resource, params) => {
        const { target, id: postId, sort } = params;

        try {
            // Construa a URL para a consulta
            const url = `${API_URL}/${resource}?${target}=${postId}&_sort=${sort.field}&_order=${sort.order}`;

            // Faça a chamada para buscar os comentários relacionados à postagem
            const response = await fetchUtils.fetchJson(url);

            // Transforme a resposta em JSON
            const data = await response.json();

            // Obtenha o total de comentários encontrados
            const total = data.length;

            // Retorna os dados dos comentários e o total
            return { data, total };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao buscar comentários relacionados: ' + error);
        }
    },
    create: async (resource, params) => {
        const { data } = params;
            console.log(JSON.stringify(data))
        try {
            // Faça a chamada para criar o novo recurso
            const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
                method: 'POST',
                body: JSON.stringify(data),
                //headers: JSON.stringify({ 'Content-Type': 'application/json' })
                
            });
            console.log(response)
            // Verifique se a requisição foi bem-sucedida (status 2xx)
            if (!response.status) {
                throw new Error('Erro ao criar recurso: ' + response);
            }

            // Transforme a resposta em JSON
            const responseData = await response.json
            const createdResource = { ...responseData, id: responseData._id };
            // Retorna os dados do novo recurso criado
            return { data: createdResource };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao criar recurso: ' + error);
        }
    },

    update: async (resource, params)=>{
        const response = await fetchUtils.fetchJson(
            `${API_URL}/${resource}/${params.id}`,
           { 
            method:"PUT",
            body: JSON.stringify(params.data)
            }
            
        )
        const responseData = await response.json
            const createdResource = { ...responseData, id: responseData._id };
        return {data: createdResource}
    },
    updateMany: async (resource, params) => {
        const { ids, data } = params;

        try {
            // Construa a URL para a atualização em massa
            const url = `${API_URL}/${resource}?${ids.map(id => `id=${id}`).join('&')}`;

            // Faça a chamada para atualizar os recursos em massa
            const response = await fetchUtils.fetchJson(url, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            // Transforme a resposta em JSON
            const responseData = await response.json();

            // Retorna os IDs dos recursos atualizados
            return { data: responseData };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao atualizar recursos em massa: ' + error);
        }
    },

    delete: async (resource, params) => {
        const { id } = params;

        try {
            // Faça a chamada para excluir o recurso
            const response = await fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
                method: 'DELETE'
            });

            // Transforme a resposta em JSON
           const responseData = await response.json
           const createdResource = { ...responseData, id: responseData._id };

            // Retorna os dados do recurso excluído
            return { data: createdResource };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao excluir recurso: ' + error);
        }
    },

    deleteMany: async (resource, params) => {
        const { ids } = params;

        try {
            // Construa a URL para a exclusão em massa
            const url = `${API_URL}/${resource}?${ids.map(id => `id=${id}`).join('&')}`;

            // Faça a chamada para excluir os recursos em massa
            const response = await fetchUtils.fetchJson(url, {
                method: 'DELETE'
            });

            // Transforme a resposta em JSON
            const responseData = await response.json();

            // Retorna os IDs dos recursos excluídos
            return { data: responseData };
        } catch (error) {
            // Em caso de erro, lança uma exceção
            throw new Error('Erro ao excluir recursos em massa: ' + error);
        }
    },

};