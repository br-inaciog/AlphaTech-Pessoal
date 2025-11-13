using CollabTechFile.Models;

namespace CollabTechFile.DTO
{
    public class UploadOCRRequest
    {
        public IFormFile Arquivo { get; set; }
        public Documento documento { get; set; }
    }
}
