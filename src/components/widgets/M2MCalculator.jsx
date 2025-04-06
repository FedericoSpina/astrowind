import { useState, useEffect } from "react";
import { supabase } from "~/utils/supabase";

const M2MCalculator = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [tables, setTables] = useState([]);
  const [textm2, setTextm2] = useState(1);
  const [notaFinal, setNotaFinal] = useState("");
  const [title, setTitle] = useState("");
  const [precioPorM2Total, setPrecioPorM2Total] = useState(0);

  const getTableFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("table") || "";
  };

  const updateURL = (tableName) => {
    const newUrl = `${window.location.pathname}?table=${tableName}`;
    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    const fetchTables = async () => {
      const { data, error } = await supabase.from("propiedades").select("tabla_modelo");
      if (error) {
        console.error("Seleccione un modelo", error);
        return;
      }
      const tableNames = [...new Set(data.map((row) => row.tabla_modelo))];
      setTables(tableNames);
    };

    fetchTables();
  }, []);

  useEffect(() => {
    const tableName = getTableFromURL();
    if (!tableName) {
      setError("Error: No se ha seleccionado una tabla.");
      setLoading(false);
      return;
    }

    setSelectedTable(tableName);
  }, []);

  useEffect(() => {
    const fetchTextM2 = async () => {
      const { data, error } = await supabase
        .from("propiedades")
        .select("textm2, nota, title")
        .eq("tabla_modelo", selectedTable)
        .single();

      if (error) {
        console.error("Error al obtener textm2", error);
      } else {
        setTextm2(parseFloat(data?.textm2) || 1);
        setNotaFinal(data?.nota || "");
        setTitle(data?.title || "");
      }
    };

    if (selectedTable) fetchTextM2();
  }, [selectedTable]);

  useEffect(() => {
    if (!selectedTable) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from(selectedTable)
          .select("id, descripcion_de_actividad, materiales, mano_de_obra");

        if (error) throw error;

        const processedData = data.map(row => ({
          ...row,
          materiales: parseFloat(row.materiales) || 0,
          mano_de_obra: parseFloat(row.mano_de_obra) || 0,
          total: (parseFloat(row.materiales) || 0) + (parseFloat(row.mano_de_obra) || 0),
        }));

        const subtotal = processedData.reduce((sum, row) => sum + row.total, 0);

        const finalData = processedData.map(row => ({
          ...row,
          porcentaje_rubro: subtotal ? ((row.total / subtotal) * 100).toFixed(2) + "%" : "0%",
        }));

        const totalMateriales = finalData.reduce((sum, row) => sum + row.materiales, 0);
        const totalManoObra = finalData.reduce((sum, row) => sum + row.mano_de_obra, 0);
        const totalGeneral = totalMateriales + totalManoObra;

        const rowSubtotales = {
          id: "Subtotales",
          descripcion_de_actividad: "Subtotales",
          materiales: totalMateriales,
          mano_de_obra: totalManoObra,
          total: totalGeneral,
          porcentaje_rubro: "100%",
        };

        const rowParticipacion = {
          id: "Participación %",
          descripcion_de_actividad: "Participación %",
          materiales: totalMateriales / totalGeneral,
          mano_de_obra: totalManoObra / totalGeneral,
          total: null,
          porcentaje_rubro: "",
        };

        const precioM2Total = totalGeneral / textm2;
        setPrecioPorM2Total(precioM2Total);

        const rowPrecioM2 = {
          id: "Precio por M2",
          descripcion_de_actividad: "Precio por M2",
          materiales: totalMateriales / textm2,
          mano_de_obra: totalManoObra / textm2,
          total: precioM2Total,
          porcentaje_rubro: "",
        };

        const rowNota = {
          id: "Nota",
          descripcion_de_actividad: notaFinal,
          materiales: null,
          mano_de_obra: null,
          total: null,
          porcentaje_rubro: "",
        };

        setData([...finalData, rowSubtotales, rowParticipacion, rowPrecioM2, rowNota]);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTable, textm2]);

  const handleTableChange = (event) => {
    const newTable = event.target.value;
    setSelectedTable(newTable);
    updateURL(newTable);
  };

  return (
    <div className="p-4 pb-8 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:text-white dark:bg-gray-900">
      <h1 className="text-xl font-bold mb-4">Selecciona un modelo</h1>

      <select value={selectedTable} onChange={handleTableChange} className="p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <option value="">-- Selecciona un modelo --</option>
        {tables.map((table, index) => (
          <option key={index} value={table}>
            {table}
          </option>
        ))}
      </select>

      {loading && <p>Loading...</p>}
      {error && <p className="text-primary">{error}</p>}

      {!loading && !error && selectedTable && (
        <>
          {title && textm2 && precioPorM2Total ? (
            <div className="mt-8 mb-8 text-lg font-semibold text-center">
              <h1 className="text-3xl font-semibold text-center font-bold"> {title} de <span className="text-primary">{textm2} m²</span>  – PRECIO m² de  <span className="text-primary"> $ {precioPorM2Total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} </span> </h1>
            </div>
          ) : null}

          <table className="w-full border-collapse border border-gray-300 mt-4 dark:border-gray-700 ">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-center">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Descripción de Actividad</th>
                <th className="border border-gray-300 px-4 py-2">Materiales</th>
                <th className="border border-gray-300 px-4 py-2">Mano de Obra</th>
                <th className="border border-gray-300 px-4 py-2">Total Mat. + M.O.</th>
                <th className="border border-gray-300 px-4 py-2">% Rubro</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{row.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.descripcion_de_actividad}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.materiales != null ? `$${row.materiales.toFixed(2)}` : ""}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.mano_de_obra != null ? `$${row.mano_de_obra.toFixed(2)}` : ""}</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">{row.total != null ? `$${row.total.toFixed(2)}` : ""}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.porcentaje_rubro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default M2MCalculator;
